
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
  Column
} from '@react-email/components';
import * as React from 'react';
import type { Order } from '@/lib/types';

interface OrderStatusEmailProps {
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
};

const box = {
  padding: '0 48px',
};

const logo = {
  margin: '0 auto',
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
    fontSize: '28px',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
};

const anchor = {
  color: '#556cd6',
};

const button = {
  backgroundColor: '#656ee8',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '10px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

const getStatusText = (status: Order['status'], orderId: string) => {
    switch(status) {
        case 'Processing':
            return `Thank you for your order! We've received order #${orderId} and are getting it ready. We will notify you when it has been shipped.`;
        case 'Confirmed':
            return `Your order #${orderId} has been confirmed! We are now preparing it for shipment. You'll receive another notification once it's on its way.`;
        case 'Shipped':
            return `Great news! Your order #${orderId} has been shipped and is on its way to you.`;
        case 'Delivered':
            return `Your order #${orderId} has been delivered. We hope you enjoy your products!`;
        case 'Cancelled':
            return `Your order #${orderId} has been cancelled. If you have any questions, please contact our support team.`;
    }
}


export const OrderStatusEmail = ({ order }: OrderStatusEmailProps) => {
    const previewText = `Your DropX Order #${order.id.slice(-6)} is ${order.status}`;
    const statusText = getStatusText(order.status, order.id.slice(-6));

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>Order {order.status}</Heading>

            <Text style={paragraph}>
              Hi {order.shippingAddress.name},
            </Text>
            <Text style={paragraph}>
              {statusText}
            </Text>
            <hr style={hr} />
            <Heading as="h2" style={{ ...heading, fontSize: '20px', textAlign: 'left' }}>Order Summary</Heading>
            
            {order.items.map(({product, quantity}) => (
                <Section key={product.id}>
                    <Row style={{ marginBottom: '16px', verticalAlign: 'top' }}>
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

            <hr style={hr} />

            <Section>
                <Row>
                    <Column><Text style={paragraph}>Subtotal</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={paragraph}>₹{order.total.toLocaleString('en-IN')}</Text></Column>
                </Row>
                <Row>
                    <Column><Text style={paragraph}>Shipping</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={paragraph}>Free</Text></Column>
                </Row>
                <hr style={{...hr, margin: '10px 0'}} />
                <Row>
                    <Column><Text style={{...paragraph, fontWeight: 'bold'}}>Total</Text></Column>
                    <Column style={{textAlign: 'right'}}><Text style={{...paragraph, fontWeight: 'bold'}}>₹{order.total.toLocaleString('en-IN')}</Text></Column>
                </Row>
            </Section>

            <hr style={hr} />
            <Text style={paragraph}>
              We appreciate your business! If you have any questions, please
              reply to this email.
            </Text>
            <Text style={footer}>
              DropX India, 123 Shopping Lane, Commerce City, IN
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderStatusEmail;
