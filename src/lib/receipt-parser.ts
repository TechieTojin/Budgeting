export interface ExtractedData {
  merchant: string;
  date: string;
  total: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  tax: number;
  subtotal: number;
  paymentMethod: string;
  confidence: number;
}

export async function parseReceipt(text: string): Promise<ExtractedData> {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid receipt text');
  }

  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/\s+/g, ' ')); // Normalize whitespace
  
  if (lines.length === 0) {
    throw new Error('No text content found in receipt');
  }
  
  // Initialize variables with default values
  let merchant = '';
  let date = '';
  let total = 0;
  let items: Array<{ name: string; price: number; quantity: number }> = [];
  let tax = 0;
  let subtotal = 0;
  let paymentMethod = '';
  
  // Quick merchant detection (first non-empty line that looks like a merchant name)
  for (const line of lines.slice(0, 3)) {
    if (line.length > 3 && line.length < 50 && 
        !line.match(/^(TOTAL|AMOUNT|DATE|RECEIPT|THANK|WELCOME)/i)) {
      merchant = line;
      break;
    }
  }
  if (!merchant) merchant = 'Unknown Merchant';
  
  // Quick date detection (common patterns)
  const datePatterns = [
    /\d{1,2}\/\d{1,2}\/\d{2,4}/, // MM/DD/YYYY
    /\d{1,2}-\d{1,2}-\d{2,4}/,   // MM-DD-YYYY
    /\d{4}-\d{1,2}-\d{1,2}/,     // YYYY-MM-DD
    /\d{1,2}\.\d{1,2}\.\d{2,4}/, // MM.DD.YYYY
  ];
  
  // Price pattern for reuse
  const pricePattern = /\$?\d+\.\d{2}/;
  
  for (const line of lines) {
    const upperLine = line.toUpperCase();
    
    // Date detection
    if (!date) {
      for (const pattern of datePatterns) {
        const match = line.match(pattern);
        if (match) {
          date = match[0];
          break;
        }
      }
    }
    
    // Total amount detection
    if (upperLine.includes('TOTAL') || upperLine.includes('AMOUNT')) {
      const amountMatch = line.match(pricePattern);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[0].replace('$', ''));
        if (amount > 0) total = amount;
      }
    }
    
    // Tax detection
    if (upperLine.includes('TAX') || upperLine.includes('VAT')) {
      const taxMatch = line.match(pricePattern);
      if (taxMatch) {
        const taxAmount = parseFloat(taxMatch[0].replace('$', ''));
        if (taxAmount > 0) tax = taxAmount;
      }
    }
    
    // Subtotal detection
    if (upperLine.includes('SUBTOTAL')) {
      const subtotalMatch = line.match(pricePattern);
      if (subtotalMatch) {
        const subtotalAmount = parseFloat(subtotalMatch[0].replace('$', ''));
        if (subtotalAmount > 0) subtotal = subtotalAmount;
      }
    }
    
    // Item detection (improved)
    const priceMatch = line.match(pricePattern);
    if (priceMatch && 
        !upperLine.includes('TOTAL') && 
        !upperLine.includes('TAX') && 
        !upperLine.includes('SUBTOTAL') &&
        !upperLine.includes('BALANCE') &&
        !upperLine.includes('CHANGE')) {
      const price = parseFloat(priceMatch[0].replace('$', ''));
      const name = line.replace(priceMatch[0], '').trim();
      
      // Skip if price is too high (likely not an item)
      if (name && price > 0 && price < (total || 1000)) {
        // Check for quantity
        const quantityMatch = name.match(/^(\d+)\s*[xX]\s*/);
        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
        const cleanName = quantityMatch ? name.replace(quantityMatch[0], '').trim() : name;
        
        items.push({
          name: cleanName,
          price: price / quantity, // Price per item
          quantity
        });
      }
    }
    
    // Payment method detection
    if (upperLine.includes('CASH') || 
        upperLine.includes('CREDIT') || 
        upperLine.includes('DEBIT') ||
        upperLine.includes('VISA') ||
        upperLine.includes('MASTERCARD') ||
        upperLine.includes('AMEX')) {
      paymentMethod = line;
    }
  }
  
  // Validate and adjust totals
  if (total === 0 && items.length > 0) {
    total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  
  if (subtotal === 0) {
    subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  
  // Calculate confidence score (improved)
  const confidence = Math.min(
    1,
    0.3 + // Base confidence
    (merchant !== 'Unknown Merchant' ? 0.2 : 0) +
    (date ? 0.2 : 0) +
    (total > 0 ? 0.2 : 0) +
    (items.length > 0 ? 0.1 : 0) +
    (Math.abs(total - (subtotal + tax)) < 0.01 ? 0.1 : 0) // Bonus for matching totals
  );
  
  return {
    merchant,
    date: date || new Date().toISOString().split('T')[0],
    total: total || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    items,
    tax,
    subtotal: subtotal || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    paymentMethod,
    confidence
  };
} 