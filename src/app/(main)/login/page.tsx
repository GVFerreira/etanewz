import FooterCKO from "@/app/components/footer-cko"
import Header from "@/app/components/header"
import { AuthForm } from "./_components/auth-form"


export default function Auth() {
  return (
    <>
      <Header />
      <main className="flex items-center" style={{flex: "1 1 0"}}>
        <AuthForm />
      </main>
      <FooterCKO />
    </>
  )
}