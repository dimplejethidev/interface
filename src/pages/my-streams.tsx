import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import StreamsTable from "../components/widgets/StreamsTable";

const MyStreams: NextPage = () => {
    return (
        <StreamsTable />
    )
};

export default MyStreams;
