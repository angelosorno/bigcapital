import React from 'react';
import { useParams } from 'react-router-dom';

import BillForm from './BillForm';
import { BillFormProvider } from './BillFormProvider';

import 'style/pages/Bills/PageForm.scss';

export default function BillFormPage() {
  const { id } = useParams();

  return (
    <BillFormProvider billId={id}>
      <BillForm />
    </BillFormProvider>
  );
}