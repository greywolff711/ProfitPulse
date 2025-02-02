import { DataGrid } from '@mui/x-data-grid'
import DashboardBox from '../../components/DashboardBox'
import { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } from '../../state/api'
import BoxHeader from '../../components/BoxHeader'
import {Box, useTheme, Typography} from "@mui/material"
import FlexBetween from '../../components/FlexBetween'
import { Cell, Pie, PieChart } from 'recharts'
import { useMemo } from 'react'
import { Key } from '@mui/icons-material'
type Props = {}

const Row3 = (props: Props) => {
  const {data:transactionData} = useGetTransactionsQuery()
  const {data:productData}= useGetProductsQuery()
  const {data:kpiData} = useGetKpisQuery()
  const {palette} = useTheme()
  const productColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `¥${params.value}`
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `¥${params.value}`
    },
  ]

  const transactionColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "buyer",
      headerName: "Buyer",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `${params.value}`
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.35,
      renderCell: (params: GridCellParams) => `${params.value}`
    },
    {
      field: "productIds",
      headerName: "Count",
      flex: 0.35,
      renderCell: (params: GridCellParams) => `${params.value.length}`
    },
  ]
  console.log(kpiData)
  
  const pieChartData = useMemo(() => {
    if (kpiData) {
      const totalExpenses = kpiData[0].totalExpenses;
      return Object.entries(kpiData[0].expensesByCategory).filter(([_, value]) => value !== null).map(
        ([key, value]) => {
          return [
            {
              name: key,
              value: value,
            },
            {
              name: `${key} of Total`,
              value: totalExpenses - value,
            },
          ];
        }
      );
    }
  }, [kpiData])
  console.log(pieChartData)

  const pieColors = [palette.primary[800], palette.primary[500]]

  return (
    <>
      <DashboardBox gridArea="g">
        <BoxHeader
          title="List of Products"
          sideText={`${productData?.length} products`}
        />
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="75%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={productData || []}
            columns={productColumns}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="h">
        <BoxHeader
            title="Latest Transactions"
            sideText={`${productData?.length} transactions`}
          />
          <Box
            mt="1rem"
            p="0 0.5rem"
            height="80%"
            sx={{
              "& .MuiDataGrid-root": {
                color: palette.grey[300],
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${palette.grey[800]} !important`,
              },
              "& .MuiDataGrid-columnHeaders": {
                borderBottom: `1px solid ${palette.grey[800]} !important`,
              },
              "& .MuiDataGrid-columnSeparator": {
                visibility: "hidden",
              },
            }}
          >
            <DataGrid
              columnHeaderHeight={25}
              rowHeight={35}
              hideFooter={true}
              rows={transactionData || []}
              columns={transactionColumns}
            />
          </Box>
      </DashboardBox>
      <DashboardBox gridArea="i">
        <BoxHeader title="Expense Breakdown By Category" sideText="+4%" />
        <FlexBetween mt="-0.75rem" gap="0.5rem" p="0 1rem" textAlign="center">
          {pieChartData?.map((data, i) => (
            <Box key={`${data[0].name}-${i}`}>
              <PieChart width={110} height={100}>
                <Pie
                  stroke="none"
                  data={data}
                  innerRadius={18}
                  outerRadius={35}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
              </PieChart>
              <Typography variant="h5">{data[0].name}</Typography>
            </Box>
          ))}
        </FlexBetween>
      </DashboardBox>
      <DashboardBox gridArea="j">
        <BoxHeader title="Summary" sideText="growth observed" />
        <Box
          height="15px"
          margin="1.25rem 1rem 0.4rem 1rem"
          bgcolor={palette.primary[800]}
          borderRadius="1rem"
        >
          <Box
            height="15px"
            bgcolor={palette.primary[600]}
            borderRadius="1rem"
            width="40%"
          ></Box>
        </Box>
        <Typography margin="0 1rem" variant="h6">
        Each month, our finance app tracks your profit growth, highlighting revenue increases and expense management. 
        Stay on top of your goals and watch your profits grow month after month.
        </Typography>
      </DashboardBox>
    </>
  )
}

export default Row3