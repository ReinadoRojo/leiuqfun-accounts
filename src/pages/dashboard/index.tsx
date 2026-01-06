import { DoorClosedLockedIcon, HouseIcon, UserIcon } from "lucide-react"

export default function DashboardIndex() {
  return (
    <>
      <aside className="fixed h-screen w-16 flex flex-col items-center space-y-4 justify-center shadow-md">
        <ul className="menu bg-base-200 rounded-box">
          <li>
            <a className="tooltip tooltip-right" data-tip="Home" href="/dashboard">
              <HouseIcon />
            </a>
          </li>
          <li>
            <a className="tooltip tooltip-right" data-tip="Account" href="/dashboard/account">
              <UserIcon />
            </a>
          </li>
          <li>
            <a className="tooltip tooltip-right" data-tip="Admin" href="/dashboard/admin">
              <DoorClosedLockedIcon />
            </a>
          </li>
        </ul>
      </aside>
      <main className="h-full w-full pl-18">
        <h1 className="text-md font-bold underline">Dashboard Home</h1>
      </main>
    </>
  )
}