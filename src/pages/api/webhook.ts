import { prisma } from "~/server/db";
import type { IncomingHttpHeaders } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { WebhookRequiredHeaders } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

const webhookSecret: string = process.env.WEBHOOK_SECRET!;

export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse
) {
  const payload = JSON.stringify(req.body);
  const headers = req.headers;
  // Create a new Webhook instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;
  try {
    // Verify the webhook payload and headers
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (_) {
    // If the verification fails, return a 400 error
    return res.status(400).json({});
  }

  const eventType = evt.type;
  if (eventType === "user.updated") {
    const { id, ...attributes } = evt.data;
    const existingFounder = await prisma.founder.findUnique({
      where: { id },
    });
    if (existingFounder) {
      await prisma.founder.update({
        where: { id },
        data: {
          imageUrl: attributes.image_url,
        },
      });
    }

    const existingInvestor = await prisma.investor.findUnique({
      where: { id },
    });
    if (existingInvestor) {
      await prisma.investor.update({
        where: { id },
        data: {
          imageUrl: attributes.image_url,
        },
      });
    }
  }
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};
