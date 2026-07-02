/**
 * @file SupportTicket.js
 * @layer Domain - Entities
 * @description Represents a support, complaint, or feedback ticket in the CRM.
 */
export class SupportTicket {
  constructor({
    id,
    customerName,
    customerAvatar,
    type,                 // 'Khiếu nại', 'Hỗ trợ', 'Phản hồi'
    content,
    createdAt,            // Date or string
    status,               // 'new', 'assigned', 'replied', 'resolved'
    assignedStaffId,      // string or null
    assignedStaffName,    // string or null
    slaFirstResponseMinutes, // SLA first response remaining (starts at 120)
    slaResolveMinutes,       // SLA resolve remaining (starts at 1440)
    rating,               // e.g. 2 (stars) if created from low-star review
    internalNotes,        // internal log notes
    replyContent,         // sent reply
  }) {
    this.id = id;
    this.customerName = customerName;
    this.customerAvatar = customerAvatar || 'https://i.pravatar.cc/150?u=anon';
    this.type = type;
    this.content = content;
    this.createdAt = createdAt || new Date().toISOString();
    this.status = status || 'new';
    this.assignedStaffId = assignedStaffId || null;
    this.assignedStaffName = assignedStaffName || null;
    this.slaFirstResponseMinutes = slaFirstResponseMinutes !== undefined ? slaFirstResponseMinutes : 120;
    this.slaResolveMinutes = slaResolveMinutes !== undefined ? slaResolveMinutes : 1440;
    this.rating = rating || null;
    this.internalNotes = internalNotes || '';
    this.replyContent = replyContent || null;
  }
}
