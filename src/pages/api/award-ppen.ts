import { Request, Response } from 'express';
import { JsonRpcProvider, Wallet, Contract, parseUnits } from 'ethers';
import type { InterfaceAbi } from 'ethers';
import PlasticPennyABI from '@/lib/abi/PlasticPenny';// adjust path as needed

export const awardPpenHandler = async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { recipient, rawAmount } = req.body;

  if (!recipient || typeof rawAmount !== 'number') {
    return res.status(400).json({ error: 'Missing recipient or invalid amount' });
  }

  try {
    const provider = new JsonRpcProvider(process.env.RPC_URL);
    const wallet = new Wallet(process.env.APP_PRIVATE_KEY!, provider);
    const token = new Contract(
      process.env.PPEN_CONTRACT_ADDRESS!,
      PlasticPennyABI as InterfaceAbi,
      wallet
    );

    const amount = parseUnits(rawAmount.toString(), 18);
    const tx = await token.transfer(recipient, amount);
    await tx.wait();

    return res.status(200).json({ txHash: tx.hash });
  } catch (err: any) {
    console.error('PPEN transfer error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};