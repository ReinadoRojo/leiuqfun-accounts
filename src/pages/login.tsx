import { Layout } from "../layouts/general";

export const Login = (props: { client_name: string; client_id: string; }) => (
    <Layout title="Login">
        <article>
            <h3>Login {props.client_name}</h3>
            <form action="">
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">
                    Login
                </button>
            </form>
            <footer>
                <p>Client ID: {props.client_id}</p>
                <p>By clicking login you agree to the terms and conditions.</p>
            </footer>
        </article>
    </Layout>
)