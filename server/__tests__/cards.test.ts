import { describe, it, expect } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

function createCaller(ctx: TrpcContext) {
  return appRouter.createCaller(ctx);
}

describe("Cards API", () => {
  let testCardId: string;

  it("should create a new card", async () => {
    const caller = createCaller({
      req: {} as any,
      res: {} as any,
      user: null,
    });

    const result = await caller.cards.create({
      templateId: "template1",
      message: "テストメッセージです。いつもありがとうございます!",
      senderName: "美容クリニック スタッフ一同",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("string");
    expect(result.id.length).toBeGreaterThan(0);

    testCardId = result.id;
  });

  it("should retrieve a card by id", async () => {
    // First create a card
    const caller = createCaller({
      req: {} as any,
      res: {} as any,
      user: null,
    });

    const createResult = await caller.cards.create({
      templateId: "template2",
      message: "施術後のケアについてご案内です。",
      senderName: "担当者より",
    });

    // Then retrieve it
    const card = await caller.cards.getById({ id: createResult.id });

    expect(card).toBeDefined();
    expect(card.id).toBe(createResult.id);
    expect(card.templateId).toBe("template2");
    expect(card.message).toBe("施術後のケアについてご案内です。");
    expect(card.senderName).toBe("担当者より");
    expect(card.isActive).toBe(1);
  });

  it("should create a card without sender name", async () => {
    const caller = createCaller({
      req: {} as any,
      res: {} as any,
      user: null,
    });

    const result = await caller.cards.create({
      templateId: "template3",
      message: "お大事にしてください。",
    });

    expect(result).toHaveProperty("id");

    const card = await caller.cards.getById({ id: result.id });
    expect(card.senderName).toBeNull();
  });

  it("should reject message that is too long", async () => {
    const caller = createCaller({
      req: {} as any,
      res: {} as any,
      user: null,
    });

    const longMessage = "あ".repeat(201); // 201 characters

    await expect(
      caller.cards.create({
        templateId: "template1",
        message: longMessage,
      }),
    ).rejects.toThrow();
  });

  it("should reject empty message", async () => {
    const caller = createCaller({
      req: {} as any,
      res: {} as any,
      user: null,
    });

    await expect(
      caller.cards.create({
        templateId: "template1",
        message: "",
      }),
    ).rejects.toThrow();
  });

  it("should throw error for non-existent card", async () => {
    const caller = createCaller({
      req: {} as any,
      res: {} as any,
      user: null,
    });

    await expect(
      caller.cards.getById({ id: "non-existent-id-12345" }),
    ).rejects.toThrow("Card not found or inactive");
  });
});
