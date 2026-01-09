export const Register = ({ next, notice}: { next?: string; notice?: string }) => {
  return (
    <div className="card border border-2 border-base-300 card-border w-1/2 md:w-1/3 lg:w-1/4 mx-auto bg-base-100 shadow-xl">
      <div className="card-body py-4 px-6">
        <div>
          <h3 className="card-title">Register</h3>
          <p>Create a new account to get started!</p>
        </div>
        <div className="divider"></div>
        <form action={"/auth/register"} method="post" className="space-y-4" style={{
          display: "flex", flexDirection: "column", padding: "inherit"
        }}>
          <label className="floating-label">
            <span>Username</span>
            <input type="text" name="username" className="input w-full" />
          </label>
          <label className="floating-label">
            <span>Email</span>
            <input type="email" name="email" className="input w-full" />
          </label>
          <label className="floating-label">
            <span>Password</span>
            <input type="password" name="password" className="input w-full" />
          </label>
          <button className="btn btn-primary w-full" type="submit">
            Create Account
          </button>
          {next && <input type="hidden" name="next" value={next} />}
        </form>
        {notice && (
          <div role="alert" className="alert alert-warning alert-soft">
            <span>{notice}</span>
          </div>
        )}
      </div>
    </div>
  )
}