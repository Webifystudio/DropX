
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface CreatorEarningsEmailProps {
  creatorName: string;
  transactionType: 'add' | 'withdraw';
  amount: number;
  newBalance: number;
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  border: '1px solid #e6ebf1',
};

const box = {
  padding: '0 48px',
};

const logo = {
    width: '120px',
    margin: '0 auto',
    display: 'block'
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const heading = {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    color: '#333'
};

const transactionText = {
    ...paragraph,
    fontSize: '18px',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
};

const balanceContainer = {
    backgroundColor: '#f0f4ff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center' as const,
};

const balanceText = {
    fontSize: '16px',
    color: '#525f7f',
    margin: '0 0 8px 0',
};

const balanceAmount = {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    color: '#333',
    margin: 0,
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

export const CreatorEarningsEmail = ({ creatorName, transactionType, amount, newBalance }: CreatorEarningsEmailProps) => {
  const previewText = `Your earnings have been updated!`;
  const transactionVerb = transactionType === 'add' ? 'added to' : 'withdrawn from';
  const amountColor = transactionType === 'add' ? '#28a745' : '#dc3545';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src="https://i.ibb.co/CVCm52w/logo.png"
              alt="DropX Logo"
              style={logo}
            />
            <Heading style={heading}>Earnings Update</Heading>

            <Text style={paragraph}>
              Hi {creatorName},
            </Text>
            <Text style={paragraph}>
              This is a notification that your DropX creator earnings have been updated.
            </Text>
            <Hr style={hr} />
            
            <Text style={transactionText}>
              An amount of <span style={{ color: amountColor }}>₹{amount.toLocaleString('en-IN')}</span> has been {transactionVerb} your account.
            </Text>

            <Section style={balanceContainer}>
                <Text style={balanceText}>Your New Earnings Balance</Text>
                <Text style={balanceAmount}>₹{newBalance.toLocaleString('en-IN')}</Text>
            </Section>

            <Hr style={hr} />

            <Text style={paragraph}>
              If you have any questions about this transaction, please don't hesitate to reach out to our support team.
            </Text>
            <Text style={paragraph}>
              Keep up the great work!
              <br />- The DropX Team
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              DropX India, 123 Shopping Lane, Commerce City, IN.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
