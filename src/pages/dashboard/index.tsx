import { CirclePileIcon, DiamondPlusIcon, RadarIcon, TrashIcon, TriangleDashedIcon, UnlinkIcon, UserIcon } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

export default function DashboardIndex() {
  // TODO: Fetch apps from api
  const apps = [{
    id: 'uuid-1',
    name: 'App One',
    timestampAdded: new Date(),
  }, {
    id: 'uuid-2',
    name: 'App Two',
    timestampAdded: new Date(),
  }];
  
  return (
    <section className="flex flex-row space-x-6 h-full">
      <div className="card card-border border border-2 border-base-300 card-md bg-base-100 w-2/3 mx-auto max-h-[60%]">
        <div className="card-header px-7 pt-4">
          <h2 className="card-title">
            <CirclePileIcon className="inline mr-2" />
            Apps</h2>
        </div>
        <div className="card-body">
          {apps.length === 0 ? (
            <div className="text-center flex flex-col py-8 border border-dashed border-base-300 rounded-lg p-4">
             <TriangleDashedIcon className="mx-auto mb-2 size-8" />
             <p>
              There is no apps yet. When you use some app, it will appear here.
             </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {apps.map((app, idx) => (
                <Fragment key={app.id}>
                  <div className="mb-2 p-2 border border-base-300 rounded-lg flex flex-col space-y-2">
                    <div>
                      <h3 className="font-bold">{app.name}</h3>
                      <p className="text-xs">First connection {app.timestampAdded.toDateString()}</p>
                    </div>
                    <div className="flex justify-around">
                      <a className="btn btn-sm btn-info btn-square" title="More details" href={`/apps/${app.id}`}>
                        <DiamondPlusIcon className="size-5"/>
                      </a>
                      <a className="btn btn-sm btn-outline w-2/3" title="Visit app" href={`/apps/${app.id}/visit`}>
                        <RadarIcon className="size-4"/>
                        Visit app
                      </a>
                      <a className="btn btn-sm btn-square btn-error" title="Unlink app" href={`/apps/${app.id}/unlink`}>
                        <UnlinkIcon className="size-4"/>
                      </a>
                    </div>
                  </div>
                  {/* In case of not last column, create an empty object */}
                  { apps.length - 1 === idx && (idx + 1) % 3 !== 0 && (<div className="mb-2 p-2 border border-dashed border-base-300 rounded-lg flex flex-col space-y-3 text-center"></div>) }
                </Fragment>
              ))}
            </div>
          ) }
        </div>
      </div>
    </section>
  )
}