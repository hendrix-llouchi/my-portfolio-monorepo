@component('mail::message')
# New Contact Form Submission

You have received a new message from your portfolio contact form.

## Contact Details

**Name:** {{ $data['name'] }}

**Email:** {{ $data['email'] }}

@if(!empty($data['phone']))
**Phone:** {{ $data['phone'] }}
@endif

## Message

{{ $data['message'] }}

---

This message was sent from your portfolio contact form.

@endcomponent

