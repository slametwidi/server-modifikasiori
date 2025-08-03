import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12, lineHeight: 1.2 },
  header: { fontSize: 6},
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, fontWeight: 'bold' },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #333',
    paddingVertical: 4,
    marginTop: 5,
  },
  tableRow: { flexDirection: 'row', paddingVertical: 2, borderBottom: '1px solid #999' },
  col1: { width: '25%', fontSize: 7, },
  col2: { width: '15%', textAlign: 'center', fontSize: 7 },
  col3: { width: '15%', textAlign: 'center', fontSize: 7 },
  col4: { width: '15%', textAlign: 'center', fontSize: 7 },
  col5: { width: '40%', textAlign: 'center', fontSize: 7 },
});

export const OrderPdf = ({ order }) => (
  <Document>
    <Page size="A6" style={styles.page} wrap debug>
      <Text style={styles.header}>Data Order: #{order._id.slice(-6)}</Text>
      <View style={styles.subHeader}>
        <Text>Pengirim: {order.user?.name || '-'}</Text>
        <Text>Packing Team: {order.packingTeam || '-'}</Text>
      </View>

      <View wrap={false} style={styles.tableHeader}>
        <Text style={[styles.col1, { fontWeight: 'bold' }]}>Produk</Text>
        <Text style={[styles.col2, { fontWeight: 'bold' }]}>Merk</Text>
        <Text style={[styles.col3, { fontWeight: 'bold' }]}>Varian</Text>
        <Text style={[styles.col4, { fontWeight: 'bold' }]}>Qty</Text>
        <Text style={[styles.col5, { fontWeight: 'bold' }]}>Catatan</Text>
      </View>

      {order.items.map((item, i) => (
        <React.Fragment key={i}>
          {/* header ulang pas ada halaman baru */}
          {i > 0 && i % 20 === 0 && (
            <View break wrap={false} style={styles.tableHeader}>
              <Text style={[styles.col1, { fontWeight: 'bold' }]}>Produk</Text>
              <Text style={[styles.col2, { fontWeight: 'bold' }]}>Merk</Text>
              <Text style={[styles.col3, { fontWeight: 'bold' }]}>Varian</Text>
              <Text style={[styles.col4, { fontWeight: 'bold' }]}>Qty</Text>
              <Text style={[styles.col5, { fontWeight: 'bold' }]}>Catatan</Text>
            </View>
          )}
          <View wrap={false} style={styles.tableRow}>
            <Text style={styles.col1}>{item.product.name}</Text>
            <Text style={styles.col2}>{item.merkLabel}</Text>
            <Text style={styles.col3}>{item.variantLabel}</Text>
            <Text style={styles.col4}>{item.qty}</Text>
            <Text style={styles.col5}>{item.note || '-'}</Text>
          </View>
        </React.Fragment>
      ))}
    </Page>
  </Document>
);
