import { Layout } from "../layouts/general";

export const Login = (props: { redirect: boolean; to: string }) => (
    <Layout title="Login">
        <article>
            <h3>Login</h3>
            <form method="post" action="/login">
                <input type="text" name="username" placeholder="Username" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">
                    Login
                </button>
                <input type="hidden" name="redirect_to" value={props.redirect ? props.to : ""} />
            </form>
            <footer>
                <p>By clicking login you agree to the terms and conditions.</p>
            </footer>
        </article>
    </Layout>
)