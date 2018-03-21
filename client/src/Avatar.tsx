import * as React from "react";

interface AvatarProps extends React.ImgHTMLAttributes<{}> {
  userId: string;
}

export default function Avatar({ userId, ...attributes }: AvatarProps) {
  return <img src={`/avatars/${userId}.svg`} {...attributes} />;
}
