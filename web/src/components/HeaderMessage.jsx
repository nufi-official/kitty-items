export default function HeaderMessage() {
  return (
    <div className="bg-green-muted text-white text-md font-bold text-center py-3 px-2">
      This is a non-custodial wallet-less demo application developed by{" "}
      <a
        href="https://nu.fi"
        target="blank"
        className="font-bold underline hover:opacity-80"
      >
        nu.fi
      </a>
      . You can provide feedback on our{" "}
      <a
        href="https://discord.gg/nufi"
        target="blank"
        className="font-bold underline hover:opacity-80"
      >
        discord
      </a>
      .
    </div>
  )
}
