
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
} from '@react-email/components';
import * as React from 'react';
import type { WithdrawalRequest } from '@/lib/types';

interface WithdrawalRequestEmailProps {
  request: WithdrawalRequest;
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
  border: '1px solid #e6ebf1',
  borderRadius: '8px',
};

const box = {
  padding: '0 48px',
};

const heading = {
    fontSize: '28px',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    color: '#333'
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const infoSection = {
    backgroundColor: '#f0f4ff',
    border: '1px solid #d9e2ff',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '16px'
};

export const WithdrawalRequestEmail = ({ request }: WithdrawalRequestEmailProps) => {
  const previewText = `Withdrawal Request from ${request.creatorName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>💸 New Withdrawal Request</Heading>

            <Text style={paragraph}>
              A creator has requested a withdrawal. Please review the details below and process the payment.
            </Text>
            
            <Section style={infoSection}>
                <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>Creator Name</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0}}>{request.creatorName}</Text></Column>
                </Row>
                 <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>Contact Number</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0}}>{request.creatorContact}</Text></Column>
                </Row>
                 <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>UPI ID</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0}}>{request.creatorUpiId}</Text></Column>
                </Row>
            </Section>

            <Hr style={hr} />

            <Section style={infoSection}>
                <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>Current Balance</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0}}>₹{request.currentBalance.toLocaleString('en-IN')}</Text></Column>
                </Row>
                <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold', color: '#dc3545'}}>Withdrawal Amount</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0, fontWeight: 'bold', color: '#dc3545'}}>- ₹{request.withdrawalAmount.toLocaleString('en-IN')}</Text></Column>
                </Row>
                 <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>Remaining Balance</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>₹{(request.currentBalance - request.withdrawalAmount).toLocaleString('en-IN')}</Text></Column>
                </Row>
            </Section>

            <Hr style={hr} />
            
            <Text style={{ ...paragraph, textAlign: 'center' }}>
              Request submitted on {request.requestDate}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
