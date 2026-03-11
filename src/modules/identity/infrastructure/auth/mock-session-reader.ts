import {
  SessionReaderPort,
  SessionUser,
} from "@/modules/identity/application/ports/session-reader.port";

const mockAdminUser: SessionUser = {
  id: "user-platform-admin",
  email: "admin@example.com",
  roles: ["platform_admin", "platform_reviewer"],
};

export class MockSessionReader implements SessionReaderPort {
  async getCurrentUser(): Promise<SessionUser | null> {
    return mockAdminUser;
  }
}
