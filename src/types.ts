type DaysData = {
  Date: string
  Start: string
  End: string
}

export type RawUser = {
  id: number
  FullName: string
  Days: DaysData[]
}

export type PreparedUser = Pick<RawUser, 'id', 'Fullname'> & {
  monthlyDurationFormatted: string
  monthlyDurationInMs: number
  daysByDay: Record<
    string,
    {
      durationFormatted: string
      durationInMs: number
    }
  >
}
