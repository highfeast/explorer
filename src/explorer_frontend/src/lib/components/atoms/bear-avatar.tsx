import { Avatar } from "@radix-ui/themes";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral, funEmoji } from "@dicebear/collection";

const BearAvatar = ({
  did,
  size,
}: {
  did: string;
  size: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
}) => {
  // Generate the avatar URL based on the user's DID
  const avatarSvg = createAvatar(funEmoji, {
    seed: did,
    flip: true,
    radius: 50,
    backgroundType: ["gradientLinear", "solid"],
  });

  return (
    <div>
      {/* {did} */}
      <Avatar size={size} src={avatarSvg.toDataUri()} fallback={did.trim()} />
    </div>
  );
};

export default BearAvatar;
