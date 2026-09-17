import "server-only";

type PrismaErrorWithCode = {
  code?: string;
};

export async function withSerializableRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const prismaError = error as PrismaErrorWithCode;

    // P2034 = serialization failure in Prisma/PostgreSQL
    if (prismaError?.code === "P2034" && retries > 0) {
      // Small delay before retrying
      await new Promise((resolve) => setTimeout(resolve, 50 * (4 - retries)));

      return withSerializableRetry(operation, retries - 1);
    }

    throw error;
  }
}
