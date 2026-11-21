// Vesper · Today
// The main daily moment: check in, see the count that never resets, and come
// back tomorrow. Data starts from data/sample.json; what you log is saved in
// localStorage, so no backend is needed.

import { getVesperData } from "@/lib/data";
import { TodayScreen } from "./_components/TodayScreen";

export default function Page() {
  return <TodayScreen data={getVesperData()} />;
}
