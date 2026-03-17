import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Issue from "@/models/Issue";
import User from "@/models/User";
import { createIssueSchema } from "@/lib/validations";
import { sendPushToUser } from "@/lib/push";

// GET: Fetch all issues with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "500");

    await dbConnect();

    let query: any = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const issues = await Issue.find(query)
      .populate("userId", "name email image")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Always anonymize user data - never expose personal info (USP: 100% anonymous)
    const sanitizedIssues = issues.map((issue: any) => ({
      ...issue,
      userId: {
        _id: issue.userId._id,
        name: "Anonymous User",
      },
    }));

    return NextResponse.json({ issues: sanitizedIssues }, { status: 200 });
  } catch (error) {
    console.error("Fetch issues error:", error);
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 },
    );
  }
}

// POST: Create a new issue
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = createIssueSchema.parse(body);

    await dbConnect();

    // Create new issue
    const issue = await Issue.create({
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      location: {
        type: "Point",
        coordinates: [validatedData.longitude, validatedData.latitude],
      },
      address: validatedData.address,
      images: validatedData.images || [],
      userId: session.user.id,
      status: "open",
      isAnonymous:
        validatedData.isAnonymous !== undefined
          ? validatedData.isAnonymous
          : true,
    });

    const populatedIssue = await Issue.findById(issue._id).populate(
      "userId",
      "name email pushSubscriptions",
    );

    // Always anonymize - never expose personal info
    const responseIssue = populatedIssue?.toObject();
    if (responseIssue) {
      responseIssue.userId = {
        _id: responseIssue.userId._id,
        name: "Anonymous User",
      } as any;
    }

    // Send admin notification to all admins
    try {
        // Fire and forget (don't wait for email to send to respond to user)
        (async () => {
            const { sendAdminNewIssueNotification } = await import("@/lib/email");
            
            // Get all admin emails from database
            const dbAdmins = await User.find({ role: 'admin' }).select('email').lean();
            const dbAdminEmails = dbAdmins.map(admin => admin.email);
            
            // Get admin email from env (if any)
            const envAdminEmail = process.env.ADMIN_EMAIL;
            
            // Create a unique set of all admin emails
            const allAdminEmails = new Set([...dbAdminEmails]);
            if (envAdminEmail) {
                // Support comma separated list in env
                envAdminEmail.split(',').forEach(email => allAdminEmails.add(email.trim()));
            }

            if (allAdminEmails.size > 0) {
                const recipients = Array.from(allAdminEmails);
                console.log(`Sending notifications to ${recipients.length} admins:`, recipients);
                
                await sendAdminNewIssueNotification({
                    adminEmails: recipients,
                    issue,
                }).catch((err) => console.error("Failed to send admin notification:", err));

                // PUSH NOTIFICATION FOR ADMINS
                try {
                    const admins = await User.find({ role: 'admin' }).select('name email pushSubscriptions');
                    
                    for (const admin of admins) {
                        await sendPushToUser(admin, {
                            title: `🚨 New Issue: ${issue.category.toUpperCase()}`,
                            body: issue.title,
                            data: {
                                url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/issues`
                            }
                        });
                    }
                } catch (pushErr) {
                    console.error("Failed to send admin push notifications:", pushErr);
                }
            }
        })();
    } catch (err) {
        console.error("Error setting up admin notification:", err);
    }

    return NextResponse.json({ issue: responseIssue }, { status: 201 });
  } catch (error: unknown) {
    console.error("Create issue error:", error);

    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ZodError"
    ) {
      return NextResponse.json(
        { error: (error as any).errors[0].message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create issue" },
      { status: 500 },
    );
  }
}
