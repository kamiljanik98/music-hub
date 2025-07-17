const Header = ({ title }: {title: string}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-base md:text-xl font-semibold">{title}</h1>
      <p className="text-xs md:text-sm font-semibold">123 Uploads</p>
    </div>
)
}

export default Header;