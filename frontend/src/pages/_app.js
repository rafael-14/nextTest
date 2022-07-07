import Dashboard from "../components/Dashboard"
import Login from "./login"
import { useRouter } from "next/router";
import Link from "next/router";
//<Dashboard componente={Login}/>

function MyApp({ Component, pageProps }) {

  const router = useRouter();

  return (
    <>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
