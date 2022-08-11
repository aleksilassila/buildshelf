import * as AlertDialog from "../ui/AlertDialog";
import theme from "../../constants/theme";
import PrimaryButton from "../ui/button/Button";
import { NavItem } from "./NavLink";

export const LoginButton = () => (
  <AlertDialog.Root>
    <AlertDialog.Trigger>
      <NavItem>Log In</NavItem>
    </AlertDialog.Trigger>
    <AlertDialog.Content className="flex flex-col gap-6">
      <div>
        <h2 className={theme.text.display}>Log in</h2>
        <p className={theme.text.body}>Log in with a Minecraft account</p>
      </div>
      <div className="flex justify-between">
        <AlertDialog.Action>
          <a href={process.env.MICROSOFT_REDIRECT_URL}>
            <PrimaryButton mode="primary" className="w-min">
              Log in via Microsoft
            </PrimaryButton>
          </a>
        </AlertDialog.Action>
        <AlertDialog.Cancel>
          <PrimaryButton>Cancel</PrimaryButton>
        </AlertDialog.Cancel>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Root>
);
