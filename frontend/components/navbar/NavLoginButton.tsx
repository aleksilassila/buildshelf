import * as AlertDialog from "../ui/AlertDialog";
import theme from "../../constants/theme";
import Button from "../ui/Button";

export const NavLoginButton = () => (
  <AlertDialog.Root>
    <AlertDialog.Trigger>
      <div className="mx-2.5 cursor-pointer">Log In</div>
    </AlertDialog.Trigger>
    <AlertDialog.Content className="flex flex-col gap-6">
      <div>
        <h2 className={theme.text.display}>Log in</h2>
        <p className={theme.text.body}>Log in with a Minecraft account</p>
      </div>
      <div className="flex justify-between">
        <AlertDialog.Action>
          <a
            href={`https://login.live.com/oauth20_authorize.srf?client_id=e74b6ce2-9270-4f94-9bbb-8d7e9afb9a0f&scope=XboxLive.signin%20offline_access&redirect_uri=${process.env.FRONTEND_ENDPOINT}/login&response_type=code`}
          >
            <Button mode="primary" className="w-min">
              Log in via Microsoft
            </Button>
          </a>
        </AlertDialog.Action>
        <AlertDialog.Cancel>
          <Button>Cancel</Button>
        </AlertDialog.Cancel>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Root>
);
