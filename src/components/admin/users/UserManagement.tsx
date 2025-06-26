import { useAllProfilesQuery } from "@/hooks/react-query/profiles"
import { DataTable } from "./data-table"
import SearchBar from "./searchbar"
import { UserManagementCollumns } from "./collumns"
import { useState } from "react"

function UserManagement() {
  const query = useAllProfilesQuery()
  const [formattedData, setFormattedData] = useState('')

  return (
  <>
    <SearchBar/>
    <DataTable columns={UserManagementCollumns} data={[]}/>
  </>
  )
}

export default UserManagement
