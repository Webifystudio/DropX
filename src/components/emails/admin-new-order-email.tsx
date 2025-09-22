
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
  Button,
} from '@react-email/components';
import * as React from 'react';
import type { Order } from '@/lib/types';

interface AdminNewOrderEmailProps {
  order: Order;
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

const button = {
    backgroundColor: '#5E6EED',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px',
    width: '200px',
    margin: '20px auto',
  };

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

const infoSection = {
    backgroundColor: '#f0f4ff',
    border: '1px solid #d9e2ff',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '16px'
}

export const AdminNewOrderEmail = ({ order }: AdminNewOrderEmailProps) => {
  const previewText = `New Order #${order.id.slice(-6)} received!`;
  const orderUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/admin/orders`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>🎉 New Order!</Heading>

            <Text style={paragraph}>
              You've received a new order on DropX.
            </Text>
            
            <Section style={infoSection}>
                <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>Order ID</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0}}>#{order.id.slice(-6)}</Text></Column>
                </Row>
                 <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>Order Date</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0}}>{new Date(order.date.seconds * 1000).toLocaleString('en-IN')}</Text></Column>
                </Row>
                 <Row>
                    <Column><Text style={{...paragraph, margin: 0, fontWeight: 'bold'}}>Total Amount</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, margin: 0, fontWeight: 'bold', color: '#28a745' }}>₹{order.total.toLocaleString('en-IN')}</Text></Column>
                </Row>
            </Section>

            <Hr style={hr} />

            <Heading as="h2" style={{ ...heading, fontSize: '20px', textAlign: 'left' }}>Items</Heading>
            {order.items.map(({product, quantity}) => (
                <Section key={product.id} style={{marginBottom: '16px'}}>
                    <Row style={{ verticalAlign: 'top' }}>
                        <Column style={{ width: '80px' }}>
                           <Img src={product.images[0]} width="64" height="64" alt={product.name} style={{ borderRadius: '4px', border: '1px solid #ccc', objectFit: 'cover' }} />
                        </Column>
                         <Column>
                            <Text style={{...paragraph, margin: 0, fontWeight: 'bold' }}>{product.name}</Text>
                            <Text style={{...paragraph, margin: 0, fontSize: '14px' }}>Qty: {quantity}</Text>
                        </Column>
                        <Column style={{ textAlign: 'right' }}>
                             <Text style={{...paragraph, margin: 0, fontWeight: 'bold' }}>₹{(product.currentPrice * quantity).toLocaleString('en-IN')}</Text>
                        </Column>
                    </Row>
                </Section>
            ))}

            <Hr style={hr} />

            <Heading as="h2" style={{ ...heading, fontSize: '20px', textAlign: 'left' }}>Shipping Details</Heading>
            <Text style={paragraph}>
                <strong>Name:</strong> {order.shippingAddress.name}<br />
                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.pincode}<br />
                <strong>WhatsApp:</strong> {order.shippingAddress.whatsappNumber}<br />
                <strong>Email:</strong> {order.customerEmail}
            </Text>

             <Button style={button} href={orderUrl}>
                View Order in Admin Panel
            </Button>
            
            <Hr style={hr} />
            <Text style={footer}>
              This is an automated notification from DropX India.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

    