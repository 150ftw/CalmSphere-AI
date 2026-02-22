import random
import string
import os
from datetime import datetime, timedelta, timezone
import logging

logger = logging.getLogger(__name__)

# Check if testing mode is enabled
TESTING_MODE = os.environ.get('ENABLE_OTP_TESTING_MODE', 'false').lower() == 'true'

def generate_otp(length=6):
    """Generate a random 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email_sendgrid(email: str, otp: str, purpose: str = "login"):
    """
    Send OTP via SendGrid email service
    """
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail
        
        api_key = os.environ.get('SENDGRID_API_KEY')
        from_email = os.environ.get('SENDGRID_FROM_EMAIL', 'noreply@calmsphere.ai')
        
        if not api_key or api_key == 'your_sendgrid_api_key_here':
            logger.warning("SendGrid API key not configured. Email not sent.")
            return False
        
        # Email templates based on purpose
        subjects = {
            "login": "CalmSphere AI - Login Verification Code",
            "registration": "CalmSphere AI - Verify Your Account",
            "password_reset": "CalmSphere AI - Password Reset Code"
        }
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1A2F23; background-color: #F9F9F7; }}
                .container {{ max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(74, 108, 88, 0.1); overflow: hidden; }}
                .header {{ background: linear-gradient(135deg, #4A6C58 0%, #A4C3D2 100%); padding: 40px 20px; text-align: center; }}
                .header h1 {{ color: white; margin: 0; font-size: 28px; font-weight: 300; }}
                .content {{ padding: 40px 30px; }}
                .otp-box {{ background: #F9F9F7; border: 2px solid #4A6C58; border-radius: 12px; padding: 24px; text-align: center; margin: 30px 0; }}
                .otp-code {{ font-size: 42px; font-weight: bold; color: #4A6C58; letter-spacing: 8px; font-family: 'Courier New', monospace; }}
                .info-box {{ background: #E8E8E4; border-left: 4px solid #4A6C58; padding: 16px; margin: 20px 0; border-radius: 8px; }}
                .footer {{ background: #E8E8E4; padding: 20px; text-align: center; font-size: 12px; color: #6B7C70; }}
                .button {{ display: inline-block; background: #4A6C58; color: white; padding: 12px 32px; text-decoration: none; border-radius: 24px; margin: 10px 0; }}
                .crisis {{ background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 20px 0; border-radius: 8px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🧘‍♀️ CalmSphere AI</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your Mental Wellness Companion</p>
                </div>
                <div class="content">
                    <h2 style="color: #1A2F23; margin-top: 0;">Your Verification Code</h2>
                    <p>Hello,</p>
                    <p>You requested a verification code for your CalmSphere AI account. Please use the code below to complete your {purpose}:</p>
                    
                    <div class="otp-box">
                        <div style="font-size: 14px; color: #6B7C70; margin-bottom: 10px;">Your OTP Code</div>
                        <div class="otp-code">{otp}</div>
                        <div style="font-size: 12px; color: #6B7C70; margin-top: 10px;">Valid for 10 minutes</div>
                    </div>
                    
                    <div class="info-box">
                        <strong>⏰ This code expires in 10 minutes</strong><br>
                        <strong>🔒 Keep this code secure</strong> - Never share it with anyone<br>
                        <strong>❌ Didn't request this?</strong> Please ignore this email or contact support
                    </div>
                    
                    <p>If you're experiencing any difficulties, please reach out to our support team.</p>
                    
                    <div class="crisis">
                        <strong>🆘 Need immediate support?</strong><br>
                        KIRAN Mental Health Helpline: <strong>1800-599-0019</strong> (24/7)<br>
                        Emergency Services: <strong>112</strong>
                    </div>
                </div>
                <div class="footer">
                    <p><strong>CalmSphere AI</strong> - Supporting UN SDG-3: Good Health and Well-being</p>
                    <p style="margin: 5px 0;">This is an automated message. Please do not reply to this email.</p>
                    <p style="color: #9CA3AF; font-size: 11px;">CalmSphere AI is a self-help tool and not a substitute for professional mental health care.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        message = Mail(
            from_email=from_email,
            to_emails=email,
            subject=subjects.get(purpose, "CalmSphere AI - Verification Code"),
            html_content=html_content
        )
        
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        
        logger.info(f"✉️ Email OTP sent successfully to {email}. Status: {response.status_code}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to send email OTP: {e}")
        return False

def send_otp_sms_msg91(phone_number: str, otp: str, purpose: str = "login"):
    """
    Send OTP via MSG91 (India-focused SMS service)
    """
    try:
        import requests
        
        auth_key = os.environ.get('MSG91_AUTH_KEY')
        template_id = os.environ.get('MSG91_TEMPLATE_ID')
        sender_id = os.environ.get('MSG91_SENDER_ID', 'CLMSPH')
        
        if not auth_key or auth_key == 'your_msg91_auth_key_here':
            logger.warning("MSG91 credentials not configured. SMS not sent.")
            return False
        
        # Clean phone number (remove spaces, ensure +91)
        phone = phone_number.replace(" ", "").replace("-", "")
        if not phone.startswith("+"):
            phone = "+91" + phone.lstrip("+91")
        
        # MSG91 API endpoint
        url = "https://control.msg91.com/api/v5/flow/"
        
        payload = {
            "template_id": template_id,
            "short_url": "0",
            "recipients": [
                {
                    "mobiles": phone,
                    "OTP": otp,
                    "APP_NAME": "CalmSphere AI"
                }
            ]
        }
        
        headers = {
            "authkey": auth_key,
            "content-type": "application/json"
        }
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            logger.info(f"📱 SMS OTP sent successfully via MSG91 to {phone}")
            return True
        else:
            logger.error(f"❌ MSG91 API error: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"❌ Failed to send SMS OTP via MSG91: {e}")
        return False

def send_otp_sms_twilio(phone_number: str, otp: str, purpose: str = "login"):
    """
    Send OTP via Twilio (International SMS service)
    """
    try:
        from twilio.rest import Client
        
        account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        twilio_phone = os.environ.get('TWILIO_PHONE_NUMBER')
        
        if not all([account_sid, auth_token, twilio_phone]) or account_sid == 'your_twilio_account_sid_here':
            logger.warning("Twilio credentials not configured. SMS not sent.")
            return False
        
        client = Client(account_sid, auth_token)
        
        message_body = f"""CalmSphere AI - Your verification code is: {otp}

This code will expire in 10 minutes. Never share this code with anyone.

Need support? Call KIRAN: 1800-599-0019"""
        
        message = client.messages.create(
            body=message_body,
            from_=twilio_phone,
            to=phone_number
        )
        
        logger.info(f"📱 SMS OTP sent successfully via Twilio to {phone_number}. SID: {message.sid}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to send SMS OTP via Twilio: {e}")
        return False

def send_otp_email(email: str, otp: str, purpose: str = "login"):
    """Wrapper for email sending with fallback to logging"""
    testing_mode = os.environ.get('ENABLE_OTP_TESTING_MODE', 'false').lower() == 'true'
    if testing_mode:
        logger.info(f"🧪 [TESTING MODE] Email OTP to {email}: {otp}")
        return True
    return send_otp_email_sendgrid(email, otp, purpose)

def send_otp_sms(phone_number: str, otp: str, purpose: str = "login"):
    """Wrapper for SMS sending with provider selection"""
    testing_mode = os.environ.get('ENABLE_OTP_TESTING_MODE', 'false').lower() == 'true'
    if testing_mode:
        logger.info(f"🧪 [TESTING MODE] SMS OTP to {phone_number}: {otp}")
        return True
    
    use_msg91 = os.environ.get('USE_MSG91', 'true').lower() == 'true'
    
    if use_msg91:
        return send_otp_sms_msg91(phone_number, otp, purpose)
    else:
        return send_otp_sms_twilio(phone_number, otp, purpose)

async def create_and_send_otp(db, user_id: str, email: str, phone_number: str, purpose: str = "login"):
    """
    Generate OTP, store in database, and send via email and SMS
    """
    otp_code = generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    otp_doc = {
        "id": str(random.randint(100000, 999999)),
        "user_id": user_id,
        "otp_code": otp_code,
        "purpose": purpose,
        "expires_at": expires_at.isoformat(),
        "verified": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.otp_verifications.insert_one(otp_doc)
    
    # Send OTP via both channels
    email_sent = send_otp_email(email, otp_code, purpose)
    sms_sent = send_otp_sms(phone_number, otp_code, purpose)
    
    result = {
        "otp_sent": email_sent or sms_sent,
        "email_sent": email_sent,
        "sms_sent": sms_sent,
        "otp_id": otp_doc["id"]
    }
    
    # Check testing mode at runtime
    testing_mode = os.environ.get('ENABLE_OTP_TESTING_MODE', 'false').lower() == 'true'
    if testing_mode:
        result["otp_code"] = otp_code
        logger.info(f"🧪 [TESTING MODE] OTP for user {user_id}: {otp_code}")
    
    return result

async def verify_otp(db, user_id: str, otp_code: str, purpose: str = "login"):
    """
    Verify OTP code
    """
    otp_record = await db.otp_verifications.find_one({
        "user_id": user_id,
        "otp_code": otp_code,
        "purpose": purpose,
        "verified": False
    })
    
    if not otp_record:
        return {"success": False, "message": "Invalid OTP code"}
    
    expires_at = datetime.fromisoformat(otp_record['expires_at'])
    if datetime.now(timezone.utc) > expires_at:
        return {"success": False, "message": "OTP expired"}
    
    # Mark as verified
    await db.otp_verifications.update_one(
        {"id": otp_record['id']},
        {"$set": {"verified": True}}
    )
    
    return {"success": True, "message": "OTP verified successfully"}
