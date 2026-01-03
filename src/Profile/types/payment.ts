export type PaymentStatus = "paid" | "current" | "upcoming" | "overdue";

export interface PaymentMilestone {
  id: number;
  name: string;
  description: string;
  amount: number;
  percentage: number;
  dueDate: Date;
  status: PaymentStatus;
}

export const calculatePaymentMilestones = (
  totalPrice: number,
  tripStartDate: Date | null,
  bookingStatus: string,
  paymentStatus?: string
): PaymentMilestone[] => {
  const now = new Date();
  const milestones: PaymentMilestone[] = [];

  // Milestone 1: Deposit (20%)
  const depositAmount = Math.round(totalPrice * 0.2);
  const depositDueDate = new Date(now);
  depositDueDate.setDate(depositDueDate.getDate() + 3); // Due in 3 days

  let depositStatus: PaymentStatus = "current";
  if (paymentStatus === "paid" || bookingStatus === "confirmed") {
    depositStatus = "paid";
  } else if (depositDueDate < now) {
    depositStatus = "overdue";
  }

  milestones.push({
    id: 1,
    name: "Deposit Payment",
    description: "Secure your spot with a deposit",
    amount: depositAmount,
    percentage: 20,
    dueDate: depositDueDate,
    status: depositStatus,
  });

  // Milestone 2: Second Payment (30%)
  const secondAmount = Math.round(totalPrice * 0.3);
  const secondDueDate = tripStartDate
    ? new Date(tripStartDate.getTime() - 60 * 24 * 60 * 60 * 1000) // 60 days before trip
    : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  let secondStatus: PaymentStatus = "upcoming";
  if (depositStatus === "paid") {
    if (secondDueDate < now) {
      secondStatus = "overdue";
    } else if (
      secondDueDate.getTime() - now.getTime() <
      7 * 24 * 60 * 60 * 1000
    ) {
      secondStatus = "current";
    }
  }

  milestones.push({
    id: 2,
    name: "Second Installment",
    description: "Pay 30% of the total amount",
    amount: secondAmount,
    percentage: 30,
    dueDate: secondDueDate,
    status: secondStatus,
  });

  // Milestone 3: Final Payment (50%)
  const finalAmount = totalPrice - depositAmount - secondAmount;
  const finalDueDate = tripStartDate
    ? new Date(tripStartDate.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days before trip
    : new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days from now

  let finalStatus: PaymentStatus = "upcoming";
  if (secondStatus === "paid") {
    if (finalDueDate < now) {
      finalStatus = "overdue";
    } else if (
      finalDueDate.getTime() - now.getTime() <
      7 * 24 * 60 * 60 * 1000
    ) {
      finalStatus = "current";
    }
  }

  milestones.push({
    id: 3,
    name: "Final Payment",
    description: "Complete your payment before the trip",
    amount: finalAmount,
    percentage: 50,
    dueDate: finalDueDate,
    status: finalStatus,
  });

  return milestones;
};
