import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button
} from '@chakra-ui/react'
import {useEffect, useState} from "react";
import type {DataRequest} from "../../declaration"
import DataRequestAnswerModal from "./DataRequestAnswerModal";
let myHeaders = new Headers();
myHeaders.append("api-key", "abc");
myHeaders.append("Content-Type", "application/json");
let myInit = { method: 'GET',
    headers: myHeaders
};

export default function DataRequestsList() {
    const [dataRequests, setDataRequests] = useState<DataRequest[]>([])

    const RemoveDataRequest = async (dataRequestID : number) => {
        let removeIndex = dataRequests.map(item => item.DataRequestID).indexOf(dataRequestID);
        let newDataRequests = dataRequests.filter((_, index) => index !== removeIndex);
        setDataRequests(newDataRequests);
    }

    useEffect(() => {
        fetch("http://localhost:3000/dataRequest/getAllUnanswered", myInit)
            .then(res => res.json())
            .then(async dataRequests => {
                let dataRequestsList = []
                for (const dataRequest of dataRequests.data) {
                    console.log(dataRequest)
                    dataRequest.oldValue = await fetch('http://localhost:2000/getContent?id='+ dataRequest.gdpr_data.data_ID_ref + "&dataType="+ dataRequest.gdpr_data.gdpr_datatype.dataTypeName + "&attributeName=" +dataRequest.gdpr_data.attributeName).then(res => res.json().then(data => {console.log(data.data); return data.data}));
                    dataRequestsList.push(dataRequest)
                }
                setDataRequests(dataRequestsList)
                console.log("ddd",dataRequestsList)
            })

    }, []);

    return (
        <TableContainer>
            <Table variant='simple'>
                <TableCaption>Data Requests</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Data Subject Reference ID</Th>
                        <Th>Attribute name</Th>
                        <Th>Claim</Th>
                        <Th>Current Value</Th>
                        <Th>New Value</Th>
                        <Th>Request Type</Th>
                        <Th>Claim Date</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>

                    {dataRequests.map((dataRequest, i) => {  return (
                        <Tr key={i}>
                        <Td>{dataRequest.gdpr_datasubject.data_subject_id_ref}</Td>
                        <Td>{dataRequest.gdpr_data.gdpr_datatype.dataTypeName}</Td>
                        <Td>{dataRequest.claim}</Td>
                        <Td>{dataRequest.oldValue}</Td>
                            { (dataRequest.dataReqType === "RECTIFICATION") ? <Td>{dataRequest.newValue}</Td> : <Td></Td>}
                        <Td>{dataRequest.dataReqType}</Td>
                            <Td>{dataRequest.claimDate}</Td>

                            <Td> <DataRequestAnswerModal DataRequestID={dataRequest.DataRequestID} RemoveDataRequest={RemoveDataRequest}/> </Td>
                        </Tr>
                    ) })}

                </Tbody>

            </Table>
        </TableContainer>

    )
}