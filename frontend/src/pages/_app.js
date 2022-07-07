import Dashboard from "../components/Dashboard"
import Login from "./login"
import { useRouter } from "next/router";
//<Dashboard componente={Login}/>

function MyApp({ Component, pageProps }) {

  const router = useRouter();

  return (
    <>
      <Component {...pageProps} />
      <h1>teste _app</h1>
    </>
  )
}

export default MyApp
