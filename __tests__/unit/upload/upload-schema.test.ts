import { uploadSchema } from "@/lib/validations/upload";
import { it, describe, expect } from "vitest";

describe("uploadSchema", () => {
  it("accepts a valid audio file with title", () => {
    const file = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const result = uploadSchema.safeParse({ title: "test file", audio: file });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid audio file with title", () => {
    const file = new File(["invalid audio content"], "audio.jpg", {
      type: "image/jpeg",
    });
    const result = uploadSchema.safeParse({ title: "test file", audio: file });
    expect(result.success).toBe(false);
  });

  it("rejects when title is an empty string", () => {
    const file = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const result = uploadSchema.safeParse({ title: "", audio: file });
    expect(result.success).toBe(false);
  });

  it("rejects when title is missing entirely", () => {
    const file = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const result = uploadSchema.safeParse({ audio: file });
    expect(result.success).toBe(false);
  });

  it("rejects when audio file is missing entirely", () => {
    const result = uploadSchema.safeParse({ title: "test file" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid bpm", () => {
    const file = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const result = uploadSchema.safeParse({
      title: "test file",
      audio: file,
      bpm: "120",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-numeric bpm", () => {
    const file = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const result = uploadSchema.safeParse({
      title: "test file",
      audio: file,
      bpm: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects bpm below or equal 0", () => {
    const file = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const result = uploadSchema.safeParse({
      title: "test file",
      audio: file,
      bpm: "0",
    });
    expect(result.success).toBe(false);
  });

  it("accepts bpm at lower boundary (1)", () => {
    const file = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const result = uploadSchema.safeParse({
      title: "test file",
      audio: file,
      bpm: "1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects bpm above or equal 1000", () => {
    const file = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const result = uploadSchema.safeParse({
      title: "test file",
      audio: file,
      bpm: "1000",
    });
    expect(result.success).toBe(false);
  });

  it("accepts bpm at upper boundary (999)", () => {
    const file = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const result = uploadSchema.safeParse({
      title: "test file",
      audio: file,
      bpm: "999",
    });
    expect(result.success).toBe(true);
  });

  it("rejects bpm with a decimal value", () => {
    const file = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const result = uploadSchema.safeParse({
      title: "test file",
      audio: file,
      bpm: "500.5",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a negative bpm", () => {
    const file = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const result = uploadSchema.safeParse({
      title: "test file",
      audio: file,
      bpm: "-5",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid cover image", () => {
    const audio = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const cover = new File(["valid image content"], "cover.jpg", {
      type: "image/jpeg",
    });
    const result = uploadSchema.safeParse({ title: "test file", audio, cover });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid cover image", () => {
    const audio = new File(["valid audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });
    const cover = new File(["invalid image content"], "cover.mp3", {
      type: "audio/mpeg",
    });
    const result = uploadSchema.safeParse({ title: "test file", audio, cover });
    expect(result.success).toBe(false);
  });
});
