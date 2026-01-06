import { DoorClosedLockedIcon, HouseIcon, UserIcon } from "lucide-react"

type Link = {
  href: string
  icon: React.ReactNode
  tooltip: string
  permissionsRequired?: string[]
  allPermissionsRequired?: boolean
}

const links: Link[] = [
  {
    href: "/",
    icon: <HouseIcon />,
    tooltip: "Dashboard",
  },
  {
    href: "/profile",
    icon: <UserIcon />,
    tooltip: "Profile",
  },
  {
    href: "/admin",
    icon: <DoorClosedLockedIcon />,
    tooltip: "Admin",
    permissionsRequired: ["admin:access"],
    allPermissionsRequired: true,
  }
]

export const Sidebar = () => {
  return (
    <aside className="fixed h-screen w-16 flex flex-col items-center space-y-4 justify-center shadow-md">
      <ul className="menu bg-base-200 rounded-box">
        {/* TODO: Add permission conditional rendering */}
        {links.map(link => (
          <li key={link.href}>
            <a className="tooltip tooltip-right" data-tip={link.tooltip} href={link.href}>
              {link.icon}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}