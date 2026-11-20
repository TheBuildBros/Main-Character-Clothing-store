import AuthForms from "@/components/account/AuthForms";

export const metadata = {
  title: "Account | MainCharacter",
  description: "Sign in or create an account for MainCharacter",
};

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#0B1F3A] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <AuthForms />
    </main>
  );
}
