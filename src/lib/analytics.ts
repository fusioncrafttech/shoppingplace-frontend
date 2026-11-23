import type { AgentAccount, ParentOrder, PayoutLine, Recovery } from "@/types/store";

export type Analytics = {
  gmv: number;
  netGmv: number;
  directRevenue: number;
  commissionEarned: number;
  payoutLiability: number;
  paidOut: number;
  orders: number;
  activeAgents: number;
};

function inRange(iso: string, from: string, to: string) {
  const day = iso.slice(0, 10);
  return day >= from && day <= to;
}

export function computeAnalytics(
  orders: ParentOrder[],
  payouts: PayoutLine[],
  recoveries: Recovery[],
  agents: AgentAccount[],
  from: string,
  to: string,
): Analytics {
  const rangedOrders = orders.filter((order) => inRange(order.placedAt, from, to));
  const counted = rangedOrders.filter((order) =>
    order.status === "Paid" || order.status === "Partially refunded" || order.status === "Refunded",
  );

  let gmv = 0;
  let refundedBases = 0;
  let directRevenue = 0;

  counted.forEach((order) => {
    order.children.forEach((child) => {
      child.lines.forEach((line) => {
        gmv += line.base;
        refundedBases += line.refundedBase;
        if (child.sellerType === "platform") {
          directRevenue += line.base - line.refundedBase;
        }
      });
      if (child.sellerType === "platform" && child.status !== "Cancelled" && child.status !== "Returned") {
        directRevenue += child.shippingShare;
      }
    });
  });

  const rangedPayouts = payouts.filter((line) => inRange(line.captureDate, from, to));
  const commissionEarned = rangedPayouts
    .filter((line) => line.status !== "Void")
    .reduce((total, line) => total + line.commission, 0);
  const openRecovery = recoveries
    .filter((recovery) => recovery.status === "Open")
    .reduce((total, recovery) => total + recovery.amount, 0);
  const payoutLiability =
    payouts
      .filter((line) => line.status === "On hold" || line.status === "Blocked" || line.status === "Eligible")
      .reduce((total, line) => total + line.net, 0) - openRecovery;
  const paidOut = payouts
    .filter((line) => line.status === "Settled")
    .reduce((total, line) => total + line.net, 0);

  return {
    gmv,
    netGmv: gmv - refundedBases,
    directRevenue,
    commissionEarned,
    payoutLiability,
    paidOut,
    orders: counted.length,
    activeAgents: agents.filter((agent) => agent.status === "Active").length,
  };
}
