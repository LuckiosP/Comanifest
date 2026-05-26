export function getModerationReviewEmail(): string {
  return (
    process.env.MODERATION_REVIEW_EMAIL?.trim() ||
    process.env.OPERATOR_REVIEW_EMAIL?.trim() ||
    "hello@comanifest.org"
  );
}
