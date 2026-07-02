# AnhEmMotor Mobile Project

[English](#english) | [Tiếng Việt](#tieng-viet)

---

<a name="english"></a>

## English

**Copyright (C) 2026 Tran Thanh Binh, Nguyen Huynh Kim Ngan, Nguyen Trinh Anh Khoi, Trinh Minh Uyen.**

This project is licensed under the **Apache License 2.0**.

This project is the mobile application of AnhEmMotor, built with React Native and Expo.

### Table of Contents

- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Deployment & CI/CD](#deployment--cicd)

### System Requirements

- Node.js (v20 or higher)
- Expo CLI (`npm install -g eas-cli`)
- Android Studio / Xcode (if using local simulators)
- Expo Go App (for testing on a physical device)
- Access to GitHub Repository

### Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd AnhEmMotor-Mobile
npm install
```

### Environment Configuration

For local development, create a `.env` file in the root directory:

```properties
EXPO_PUBLIC_BACKEND_API_URL=<Backend url>
```

_Note: You MUST use your actual local IPv4 address (e.g., `192.168.1.5`) when testing on a physical device via Expo Go. Using `localhost` will not work because the physical device cannot resolve the computer's localhost._

### Local Development

Start the Expo development server:

```bash
npm run start
# or
npx expo start
```

A QR code will appear in your terminal. Scan it using the **Expo Go** app (Android) or the default Camera app (iOS) to launch the application on your mobile device.

### Deployment & CI/CD

The project uses GitHub Actions to automatically build native applications (Android APK and iOS Simulator App) directly on GitHub's runners without needing third-party services like EAS.

#### Workflow

1. Configure the required secrets on your GitHub Repository.
2. Create a pull request or push code to the main branch.
3. GitHub Actions will automatically run `expo prebuild` to generate native code, then use Gradle to build the Android APK and Xcodebuild to build the iOS App.
4. Once the build is successful, the artifacts (`app-release.apk` and `ios-app.zip`) will be attached to the "Latest Release" on GitHub automatically.

#### Required Secrets on GitHub Repo:

**Go to:** `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

| Secret Name                   | Description                    | Example                         |
| ----------------------------- | ------------------------------ | ------------------------------- |
| `EXPO_PUBLIC_BACKEND_API_URL` | Backend API URL for Production | `https://api.anhemmotor.online` |

---

<a name="tieng-viet"></a>

## Tiếng Việt

**Copyright (C) 2026 Tran Thanh Binh, Nguyen Huynh Kim Ngan, Nguyen Trinh Anh Khoi, Trinh Minh Uyen.**

Dự án này được cấp phép theo **Giấy phép Apache 2.0**.

Dự án này là ứng dụng di động của hệ thống AnhEmMotor, được xây dựng bằng React Native và Expo.

### Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình Môi trường](#cấu-hình-môi-trường)
- [Chạy Local Development](#chạy-local-development)
- [Deployment & CI/CD](#deployment--cicd-1)

### Yêu cầu hệ thống

- Node.js (v20 trở lên)
- Expo CLI (`npm install -g eas-cli`)
- Android Studio / Xcode (nếu muốn dùng máy ảo)
- App Expo Go (nếu muốn test trên điện thoại thật)
- Access to GitHub Repository

### Cài đặt

Clone dự án và cài đặt dependencies:

```bash
git clone <repo-url>
cd AnhEmMotor-Mobile
npm install
```

### Cấu hình Môi trường

Để chạy trên máy tính cá nhân (local), hãy tạo file `.env` ở thư mục gốc:

```properties
# Backend API URL
EXPO_PUBLIC_BACKEND_API_URL=http://<YOUR_LOCAL_IP>:5000
```

_Lưu ý: Bạn BẮT BUỘC phải dùng địa chỉ IP thật của máy tính (VD: `192.168.1.5`) khi test trên điện thoại thật qua Expo Go. Sử dụng `localhost` sẽ bị lỗi mạng do điện thoại không hiểu localhost của máy tính._

### Chạy Local Development

Khởi động server Expo:

```bash
npm run start
# hoặc
npx expo start
```

Một mã QR sẽ hiện ra trên terminal. Sử dụng ứng dụng **Expo Go** (trên Android) hoặc ứng dụng Camera mặc định (trên iOS) để quét mã QR và mở ứng dụng trên điện thoại.

### Deployment & CI/CD

Dự án sử dụng GitHub Actions để tự động build ứng dụng (Android APK và iOS Simulator App) trực tiếp trên máy chủ của GitHub mà không cần dùng dịch vụ bên thứ 3 như EAS.

#### Workflow (Quy trình)

1. Cấu hình các secrets cần thiết trên GitHub Repository.
2. Tạo pull request hoặc push code trực tiếp lên nhánh chính (main).
3. GitHub Actions sẽ tự động chạy `expo prebuild` để sinh code native, sau đó dùng Gradle để build Android APK và Xcodebuild để build iOS App.
4. Khi build thành công, các file cài đặt (`app-release.apk` và `ios-app.zip`) sẽ được tự động đính kèm vào mục "Latest Release" trên GitHub.

#### Các Secrets cần cấu hình trên GitHub Repo:

**Vào:** `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

| Secret Name                   | Mô Tả                          | Ví Dụ                           |
| ----------------------------- | ------------------------------ | ------------------------------- |
| `EXPO_PUBLIC_BACKEND_API_URL` | URL Backend API cho Production | `https://api.anhemmotor.online` |
