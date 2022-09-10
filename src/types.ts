type DaysData = {
  Date: string
  Start: string
  End: string
}

export type RawUser = {
  id: number
  Fullname: string
  Days: DaysData[]
}

export type PreparedUser = Pick<RawUser, 'id'> & {
  monthlyDurationFormatted: string
  monthlyDurationInMs: number
  fullName: string
  daysByDay: Record<
    string,
    {
      durationFormatted: string
      durationInMs: number
    }
  >
}
