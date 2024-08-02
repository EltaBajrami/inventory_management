'use client'

import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import { Box, Modal, Stack, TextField, Typography, Button} from "@mui/material";
import { collection, deleteDoc, getDocs, query, doc, setDoc, getDoc} from "firebase/firestore";
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default function Home() {
const [inventory, setInventory] = useState([])
const [open, setOpen] = useState(false)
const [itemName, setItemName] = useState('')
const [searchTerm, setSearchTerm] = useState('')


const updateInventory = async () => {
  const snapshot = query(collection(firestore, 'inventory'))
  const docs = await getDocs(snapshot)
  const inventoryList = []
  docs.forEach((doc) => {
    inventoryList.push({
      name: doc.id,
      ...doc.data(), 
    })
  })
  setInventory(inventoryList)
}

const removeItem = async(item) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)

  if(docSnap.exists()){
    const {quantity} = docSnap.data()
    if(quantity === 1){
      await deleteDoc(docRef)
    }
    else{
      await setDoc(docRef, {quantity: quantity - 1})
    }
  }

  await updateInventory()
}

const addItem = async(item) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)

  if(docSnap.exists()){
    const {quantity} = docSnap.data() 
    await setDoc(docRef, {quantity: quantity + 1})
  }
  else{
    await setDoc(docRef, {quantity: 1})
  }

  await updateInventory()
}

useEffect(() => {
  updateInventory()
}, [])

const handleOpen = () => setOpen(true)
const handleClose = () => setOpen(false)

const filteredInventory = inventory.filter(item => 
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
)

return (
    <Box className="container"
    width="100vw" 
    height="100vh" 
    display="flex" 
    flexDirection="column"
    justifyContent="center" 
    alignItems="center" 
    gap={2}
    >
    <Modal open={open} onClose={handleClose}>
      <Box className="inventory-item"
        position="absolute"
        top="50%"
        left="50%"
        width={400}
        bgcolor="white"
        border="2 px solid black"
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{
          transform:'translate(-50%,-50%)'
        }}
      >
        <Typography variant="h6">Add Item</Typography>

        <Stack width="100%" direction="row" spacing={2}>
          <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e)=>{
              setItemName(e.target.value)
            }}
          ></TextField>
          <Button variant="outlined" onClick={()=>{
            addItem(itemName)
            setItemName("")
            handleClose()
          }}>
            Add
          </Button>
        </Stack>

      </Box>
    </Modal>
   
    <Box className="inventory-item" display="flex" alignItems="center" gap={53} mb={2}>

      <Button
        variant="contained"
        onClick={()=>{
          handleOpen()
        }}
      >
        Add new item
      </Button>

      <TextField
          className="sbutton"
          variant="outlined"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
               
    </Box>

    <Box border="1px solid black">
      <Box 
        width="800px" 
        height="100px" 
        bgcolor="lightpink" 
        display="flex" 
        alignItems="center" 
        justifyContent="center">
        
        <Typography variant="h2" color="white"> Inventory Items </Typography>
      </Box>

    <Stack width="800px" height="300px" spacing={2} overflow="auto">
      {
        filteredInventory.map(({name, quantity}) => (
          <Box className="inventory-item"
          key={name}
          width="100%"
          minHeight="150px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bgColor="gray"
          padding={5}
          >
            <Typography variant="h3" color="#333" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>

            <Typography variant="h3" color="#333" textAlign="center">
              {quantity}
            </Typography>

            <Button
              variant="contained"
              onClick={()=>{
              addItem(name)
              }}
              >
              +
            </Button>

            <Button
              variant="contained"
              onClick={()=>{
              removeItem(name)
              }}
              >
              -
            </Button>
          </Box>
        ))
      }
    </Stack>

    </Box>
  </Box>
)
}
