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
          <a href={process.env.MICROSOFT_REDIRECT_URL}>
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
