
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
  Button,
} from '@react-email/components';
import * as React from 'react';

interface SupportTicketEmailProps {
  userName: string;
  userEmail: string;
  userPhone: string;
  problem: string;
  date: string;
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

export const SupportTicketEmail = ({ 
    userName, 
    userEmail, 
    userPhone, 
    problem,
    date
}: SupportTicketEmailProps) => {
  const previewText = `New Support Ticket from ${userName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>🚨 New Support Ticket</Heading>

            <Text style={paragraph}>
              A new support request has been submitted via the AI support chat.
            </Text>
            
            <Section style={infoSection}>
                <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>Date</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0}}>{date}</Text></Column>
                </Row>
                 <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>From</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0}}>{userName}</Text></Column>
                </Row>
                 <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>Email</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0}}>{userEmail}</Text></Column>
                </Row>
                <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>Phone</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0}}>{userPhone}</Text></Column>
                </Row>
            </Section>

            <Hr style={hr} />

            <Heading as="h2" style={{ ...heading, fontSize: '20px', textAlign: 'left' }}>User's Message</Heading>
            <Text style={{...paragraph, whiteSpace: 'pre-wrap', backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #e9ecef'}}>
                {problem}
            </Text>
            
            <Hr style={hr} />
            <Text style={{ ...paragraph, textAlign: 'center' }}>
              Please follow up with the customer as soon as possible.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
