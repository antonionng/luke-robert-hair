/**
 * Admin Update Lead API
 * Update lead information
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { leadId, updates } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    // Prepare updates for Supabase (map frontend fields to database fields)
    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    };

    // Map common fields
    if (updates.name) {
      const [firstName, ...lastNameParts] = updates.name.split(' ');
      dbUpdates.first_name = firstName;
      dbUpdates.last_name = lastNameParts.join(' ') || firstName;
    }
    if (updates.email) dbUpdates.email = updates.email;
    if (updates.phone) dbUpdates.phone = updates.phone;
    if (updates.course) dbUpdates.course_interest = updates.course;
    if (updates.lifecycle_stage) dbUpdates.lifecycle_stage = updates.lifecycle_stage;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    // Map custom fields (CPD-specific)
    const customFields: any = {};
    if (updates.institution) customFields.institution = updates.institution;
    if (updates.jobTitle) customFields.jobTitle = updates.jobTitle;
    if (updates.studentNumbers) customFields.studentNumbers = updates.studentNumbers;
    if (updates.deliveryPreference) customFields.deliveryPreference = updates.deliveryPreference;
    if (updates.experienceLevel) customFields.experienceLevel = updates.experienceLevel;

    // Merge with existing custom_fields
    if (Object.keys(customFields).length > 0) {
      // First, get existing custom_fields
      const { data: existingLead } = await supabase
        .from('leads')
        .select('custom_fields')
        .eq('id', leadId)
        .single();

      const existing = (existingLead?.custom_fields as any) || {};
      dbUpdates.custom_fields = { ...existing, ...customFields };
    }

    // Update the lead
    const { data, error } = await supabase
      .from('leads')
      .update(dbUpdates)
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log the update activity
    await supabase.from('lead_activities').insert({
      lead_id: leadId,
      activity_type: 'lead_updated',
      activity_data: {
        updated_fields: Object.keys(updates),
        timestamp: new Date().toISOString(),
      },
      automated: false,
    });

    return NextResponse.json({
      success: true,
      lead: data,
    });
  } catch (error: any) {
    console.error('Update lead error:', error);
    return NextResponse.json(
      { error: 'Failed to update lead', details: error.message },
      { status: 500 }
    );
  }
}



