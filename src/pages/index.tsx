export const Index = () => {
  const script = `
    document.querySelector("button").onclick = () => {
      const client_id = document.querySelector("input[name='client_id']").value;
      const redirect_uri = document.querySelector("input[name='redirect_uri']").value;
      const state = document.querySelector("input[name='state']").value;

      const params = new URLSearchParams({
        client_id,
        redirect_uri,
        state
      });

      window.location.href = "/authorize?" + params.toString();
    }
  `
  return (
    <div>
      <h3>Test it!</h3>
      <input type="text" name="client_id" placeholder="Client ID" />
      <input type="text" name="redirect_uri" placeholder="Redirect URI" />
      <input type="text" name="state" placeholder="State" />
      <button type="button">Authorize</button>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </div>
  )
}