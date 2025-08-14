import { RoleDisplayWidget } from "@/components/business/widgets/RoleDisplayWidget";
import { Alert } from "@/components/common/Alert";
import { Modal } from "@/components/common/Modal";
import { SearchBox } from "@/components/common/SearchBox";
import { Badge, Table } from "lucide-react";

// utils/formatters.ts
export const formatters = {
    currency: (amount: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    },
  
    percentage: (value: number): string => {
      return `${value}%`;
    },
  
    date: (date: Date | string): string => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
  
    datetime: (date: Date | string): string => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  
    phone: (phone: string): string => {
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      return phone;
    },
  
    truncate: (text: string, length: number = 50): string => {
      if (text.length <= length) return text;
      return text.slice(0, length) + '...';
    },
  
    capitalize: (text: string): string => {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
  
    camelToTitle: (text: string): string => {
      return text
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
    },
  };
  
  export default {
    Table,
    SearchBox,
    Modal,
    Badge,
    Alert,
    RoleDisplayWidget,
    formatters,
  };