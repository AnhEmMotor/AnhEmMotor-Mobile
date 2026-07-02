import { MY_VEHICLES } from '../../../constants/vehicleData';

const SERVICE_HISTORY = [
  {
    id: 1,
    date: '08/05/2026',
    title: 'Bảo dưỡng định kỳ 15.000km',
    items: ['Thay nhớt động cơ 10W-40', 'Thay lọc nhớt', 'Thay lọc gió', 'Kiểm tra phanh'],
    cost: '1.250.000đ',
    technician: 'Minh Kỹ thuật',
    status: 'done',
  },
  {
    id: 2,
    date: '15/02/2026',
    title: 'Thay lốp & Căng xích',
    items: ['Thay lốp trước Michelin', 'Căng xích truyền động', 'Bơm lốp chuẩn áp suất'],
    cost: '2.100.000đ',
    technician: 'Hùng Kỹ thuật',
    status: 'done',
  },
  {
    id: 3,
    date: '10/01/2026',
    title: 'Kiểm tra khi mua xe',
    items: ['Kiểm tra tổng thể 24 hạng mục', 'Cân bằng bánh xe', 'Kiểm tra hệ thống điện'],
    cost: 'Miễn phí',
    technician: 'Đội kỹ thuật AnhEmMotor',
    status: 'done',
  },
];

const UPCOMING_REMINDERS = [
  { km: '20.000km', task: 'Thay nhớt & Lọc nhớt', dueDate: 'Dự kiến: Tháng 8/2026' },
  { km: '25.000km', task: 'Thay bugi', dueDate: 'Dự kiến: Tháng 11/2026' },
  { km: 'Mỗi năm', task: 'Gia hạn bảo hiểm xe', dueDate: 'Hết hạn: 01/01/2027' },
];

export class MockCustomerDataSource {
  async getVehicles() {
    return MY_VEHICLES;
  }

  async getServiceHistory(vehicleId) {
    // For now, return the static service history list
    return SERVICE_HISTORY;
  }

  async getUpcomingReminders(vehicleId) {
    // For now, return the static reminders list
    return UPCOMING_REMINDERS;
  }
}
