import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { isAddress } from 'ethers';
import { Network } from 'alchemy-sdk';

const HomePage = () => {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState(Network.ETH_MAINNET);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
    if (error) {
      setError('');
    }
  };

  const handleNetworkChange = (event: SelectChangeEvent) => {
    setNetwork(event.target.value as Network);
  };

  const handleSubmit = () => {
    if (isAddress(address)) {
      router.push(`/${network}/transactions/${address}`);
    } else {
      setError('Invalid address. Please enter a valid Ethereum address.');
    }
  };

  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h4">Welcome to the Blockchain Explorer</Typography>
      <Typography variant="body1" mt={2}>
        This is a simple web application to explore blockchain transactions and their details.
      </Typography>
      <Box mt={4}>
        <FormControl fullWidth>
          <InputLabel>Network</InputLabel>
          <Select value={network} onChange={handleNetworkChange}>
            <MenuItem value={Network.ETH_MAINNET}>Ethereum Mainnet</MenuItem>
            <MenuItem value={Network.MATIC_MAINNET}>Polygon Mainnet</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Enter Address"
          variant="outlined"
          value={address}
          onChange={handleInputChange}
          fullWidth
          error={!!error}
          helperText={error}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
          View Transactions
        </Button>

        <Box mt={4}>
          <Button
            color="info"
            onClick={() => {
              setAddress('0x4103c267Fba03A1Df4fe84Bc28092d629Fa3f422');
            }}
          >
            Try default address
          </Button>
        </Box>

        {error && (
          <Box mt={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
